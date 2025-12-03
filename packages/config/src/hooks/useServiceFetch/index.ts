/*
 * ================================================================
 * FILE: index.ts
 * PATH: /packages/config/src/hooks/useServiceFetch/index.ts
 * DESCRIPTION: Export useServiceFetch hook and related types
 * VERSION: v1.0.0
 * CREATED: 2025-11-29
 * UPDATED: 2025-11-29
 * ================================================================
 */

export {
  useServiceFetch,
  SERVICE_CONFIGS,
  type ServiceFetchStatus,
  type ServiceFetchState,
  type ServiceConfig,
  type UseServiceFetchOptions,
  type UseServiceFetchReturn,
  type ServiceName,
} from './useServiceFetch';

/*
 * TODO: Add gRPC service hook
 *
 * For gRPC communication, we'll need a separate hook:
 * - useGrpcService - for gRPC client calls
 *
 * gRPC uses different protocol and requires:
 * - protobuf client generation
 * - gRPC-web for browser compatibility
 * - Different error handling (gRPC status codes)
 *
 * Implementation will be added when we set up gRPC-web in frontend.
 * See: docs/architecture/grpc-setup.md (TODO)
 */
